(function() {
    /*global angular*/
    'use strict';
    var stuffToRun = [];

    angular.shadowDirective = function (directiveName, directiveProvider) {
        stuffToRun.push({directiveName: directiveName, directiveProvider: directiveProvider});
    };

    angular.module('shadowDirective', [])
        .config(['$compileProvider', function ($compileProvider) {
            angular.registerDirective = $compileProvider.directive;
        }])
        .run(['$injector', '$compile', '$templateRequest', function ($injector, $compile, $templateRequest) {
            stuffToRun.forEach(function (itemToRun) {
                var directive = $injector.invoke(itemToRun.directiveProvider);
                directive.oldLink = directive.link;
                var styleUrl = directive.styleUrl;
                directive.link = function (scope, element, attrs, ctrl) {
                    var shadowParent = element[0].createShadowRoot();
                    if(styleUrl) {
                        $templateRequest(styleUrl).then(function(content) {
                            var styleTag = document.createElement("style");
                            styleTag.innerText = content;
                            shadowParent.appendChild(styleTag);
                        })
                    }
                    element.find('[ng-transclude]')[0].removeAttribute('ng-transclude');
                    var compiled = $compile(element.children())(scope);
                    angular.forEach(compiled, function (compiledItem) {
                        shadowParent.appendChild(compiledItem);
                    });
                    if(directive.oldLink) {
                        directive.oldLink.apply(directive, arguments);
                    }
                };
                angular.registerDirective(itemToRun.directiveName, function () {
                    return directive;
                })
            });
        }]);
})();