(function () {
    'use strict';

    angular
        .module('tr.layout.sidenav')
        .constant('menuContent', menuContent());

    function menuContent() {
        var content = [];
        var app = {
            name: 'Recherches',
            type: 'heading',
            children: [
                {
                    name: 'Personnes',
                    type: 'toggle',
                    icon: 'person',
                    pages: [
                        {
                            name: 'Recherche simplifiée',
                            state: 'person.simple',
                            type: 'link'
                        }, {
                            name: 'Recherche avancée',
                            state: 'person.advanced',
                            type: 'link'
                        }]
                },
                {
                    name: 'UA',
                    type: 'toggle',
                    icon: 'domain',
                    pages: [
                        {
                            name: 'Organnigrame',
                            state: 'main.movies-search',
                            type: 'link'
                        }, {
                            name: 'Avancée',
                            state: 'main.movies-list',
                            type: 'link'
                        }, {
                            name: 'Par attribution',
                            state: 'main.movies-edit',
                            type: 'link'
                        }]

                }
            ]
        };
        content.push(app);
        return content;
    }

})();