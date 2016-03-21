(function () {
    'use strict';

    angular
        .module('tr.layout.sidenav')
        .factory('sidenavService', sidenavService);

    function sidenavService() {
        var openedSection;
        var currentPage;

        return {
            selectSection: selectSection,
            toggleSelectSection: toggleSelectSection,
            isSectionSelected: isSectionSelected,
            selectPage: selectPage,
            isPageSelected: isPageSelected,
            isSectionActive: isSectionActive
        };

        function selectSection(section) {
            openedSection = section;
        }

        function toggleSelectSection(section) {
            openedSection = openedSection === section ? null : section;
        }

        function isSectionSelected(section) {
            return openedSection === section;
        }

        function selectPage(section, page) {
            currentPage = page;
        }

        function isPageSelected(page) {
            return currentPage === page;
        }

        function isSectionActive(section) {
            if (isSectionSelected(section)) {
                return true;
            } else if (section.children) {
                var isChildSelected = false;
                section.children.forEach(function isChildActive(childSection) {
                    if (isSectionSelected(childSection)) {
                        isChildSelected = true;
                    }
                });
                return isChildSelected;
            }
            return false;
        }
    }
})();
