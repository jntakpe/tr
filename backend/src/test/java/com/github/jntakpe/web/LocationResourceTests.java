package com.github.jntakpe.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.jntakpe.config.UriConstants;
import com.github.jntakpe.entity.Location;
import com.github.jntakpe.service.LocationService;
import com.github.jntakpe.utils.LocationTestsUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.Collections;

import static com.github.jntakpe.web.WebTestsUtils.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Tests associés à la ressource REST {@link LocationResource}
 *
 * @author jntakpe
 */
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
public class LocationResourceTests {

    @Autowired
    private LocationTestsUtils locationTestsUtils;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ObjectMapper objectMapper;

    @Mock
    private LocationService mockLocationService;

    private MockMvc realMvc;

    private MockMvc mockMvc;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        this.realMvc = MockMvcBuilders.webAppContextSetup(this.webApplicationContext).build();
        this.mockMvc = MockMvcBuilders.standaloneSetup(new LocationResource(mockLocationService)).build();
    }

    @Test
    public void findAll_shouldFind() throws Exception {
        ResultActions resultActions = realMvc.perform(get(UriConstants.LOCATIONS).accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        expectArrayNotEmpty(resultActions);
        resultActions.andExpect(jsonPath("$.[*].name").isNotEmpty());
    }

    @Test
    public void findAll_shouldNotFind() throws Exception {
        when(mockLocationService.findAll()).thenReturn(Collections.emptyList());
        ResultActions resultActions = mockMvc.perform(get(UriConstants.LOCATIONS).accept(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        expectArrayEmpty(resultActions);
    }

    @Test
    public void create_shouldCreate() throws Exception {
        String name = "some location";
        String city = "some city";
        Location location = new Location();
        location.setName(name);
        location.setCity(city);
        ResultActions resultActions = realMvc.perform(post(UriConstants.LOCATIONS)
                .content(objectMapper.writeValueAsBytes(location))
                .contentType(MediaType.APPLICATION_JSON));
        expectIsCreatedAndJsonContent(resultActions);
        expectObjectExists(resultActions);
        resultActions.andExpect(jsonPath("$.id").isNumber());
        resultActions.andExpect(jsonPath("$.name").value(name));
        resultActions.andExpect(jsonPath("$.city").value(city));
    }

    @Test
    public void create_shouldFailCuzMissingValue() throws Exception {
        Location location = new Location();
        ResultActions resultActions = realMvc.perform(post(UriConstants.LOCATIONS)
                .content(objectMapper.writeValueAsBytes(location))
                .contentType(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isBadRequest());
    }

    @Test
    public void create_shouldFailCuzNameAlreadyTaken() throws Exception {
        Location location = new Location();
        location.setName(locationTestsUtils.findAnyLocation().getName());
        ResultActions resultActions = realMvc.perform(post(UriConstants.LOCATIONS)
                .content(objectMapper.writeValueAsBytes(location))
                .contentType(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isBadRequest());
        resultActions.andDo(print());
    }

    @Test
    public void update_shouldUpdate() throws Exception {
        Location location = locationTestsUtils.findAnyLocation();
        String updatedName = "updated location";
        location.setName(updatedName);
        ResultActions resultActions = realMvc.perform(put(UriConstants.LOCATIONS + "/{id}", location.getId())
                .content(objectMapper.writeValueAsBytes(location))
                .contentType(MediaType.APPLICATION_JSON));
        expectIsOkAndJsonContent(resultActions);
        expectObjectExists(resultActions);
        resultActions.andExpect(jsonPath("$.name").value(updatedName));
    }

    @Test
    public void update_shouldFailCuzMissingValue() throws Exception {
        Location location = locationTestsUtils.findAnyLocation();
        location.setName(null);
        ResultActions resultActions = realMvc.perform(put(UriConstants.LOCATIONS + "/{id}", location.getId())
                .content(objectMapper.writeValueAsBytes(location))
                .contentType(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isBadRequest());
    }

    @Test
    public void delete_shouldDelete() throws Exception {
        Location location = locationTestsUtils.findAnyLocation();
        ResultActions resultActions = realMvc.perform(delete(UriConstants.LOCATIONS + "/{id}", location.getId())
                .contentType(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isNoContent());
    }

    @Test
    public void delete_shouldFailCuzIdDoesntExist() throws Exception {
        ResultActions resultActions = realMvc.perform(delete(UriConstants.LOCATIONS + "/{id}", 999L)
                .contentType(MediaType.APPLICATION_JSON));
        resultActions.andExpect(status().isNotFound());
    }
}
