package com.github.jntakpe.dto;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.Objects;

/**
 * Représentation par défault d'une page
 *
 * @author jntakpe
 */
public class PageDTO {

    private int page = 0;

    private int size = 10;

    private String direction;

    private String column;

    public PageRequest toPageRequest() {
        if (Objects.isNull(column)) {
            return new PageRequest(page, size);
        }
        return new PageRequest(page, size, Sort.Direction.fromString(direction), column);
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public String getColumn() {
        return column;
    }

    public void setColumn(String column) {
        this.column = column;
    }
}
