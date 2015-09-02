(function() {
    /*global angular*/
    'use strict';
    var stuffToRun = [];

    angular.shadowDirective = function (directiveName, directiveProvider) {
        stuffToRun.push({directiveName: directiveName, directiveProvider: directiveProvider});
    };

    angular.module('shadowDirective', [])
        .config(function ($compileProvider) {
            angular.registerDirective = $compileProvider.directive;
        })
        .run(function ($injector, $compile) {
            stuffToRun.forEach(function (itemToRun) {
                var directive = $injector.invoke(itemToRun.directiveProvider);
                directive.oldLink = directive.link;
                directive.link = function (scope, element, attrs, ctrl) {
                    var shadowParent = element[0].createShadowRoot();
                    var compiled = $compile(element.children())(scope);
                    angular.forEach(compiled, function (compiledItem) {
                        shadowParent.appendChild(compiledItem);
                    });
                    directive.oldLink.apply(directive, arguments);
                };
                angular.registerDirective(itemToRun.directiveName, function () {
                    return directive;
                })
            });
        });
})();