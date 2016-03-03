var app = angular.module("Resume", [])
        .directive("footerElement", function () {
            return {
                restrict: "E",
                "templateUrl": "partials/footer.html"
            };
        })
        .directive("reachedToBottom", ["$window", function ($window) {
                return {
                    link: function (scope, element, attrs) {
                        angular.element($window).bind("scroll", function () {
                            if (element[0].getBoundingClientRect().bottom - this.innerHeight < 0) {
                                scope.$apply(attrs.reachedToBottom);
                            }
                        });
                    }
                }
            }])
        .directive("onBeforePrint", ["$window", "$rootScope", "$timeout", function onBeforePrint($window, $rootScope, $timeout) {
                var beforePrintDirty = false;
                var listeners = [];
                var beforePrint = function () {
                    if (beforePrintDirty)
                        return;
                    beforePrintDirty = true;
                    if (listeners) {
                        for (var i = 0, len = listeners.length; i < len; i++) {
                            listeners[i].triggerHandler("beforePrint");
                        }
                        var scopePhase = $rootScope.$$phase;

                        // This must be synchronious so we call digest here.
                        if (scopePhase != "$apply" && scopePhase != "$digest") {
                            $rootScope.$digest();
                        }
                    }
                    $timeout(function () {
                        // This is used for Webkit. For some reason this gets called twice there.
                        beforePrintDirty = false;
                    }, 100, false);
                };
                if ($window.matchMedia) {
                    var mediaQueryList = $window.matchMedia("print");
                    mediaQueryList.addListener(function (mql) {
                        if (mql.matches)
                            beforePrint();
                    });
                }
                $window.onbeforeprint = beforePrint;
                return function (scope, element, attrs) {
                    function onBeforePrint() {
                        $("html").addClass("print");
                        $timeout(function () {
                            scope.$eval(attrs.onBeforePrint);
                        });
                    }
                    listeners.push(element);
                    element.on("beforePrint", onBeforePrint);
                    scope.$on("$destroy", function () {
                        element.off("beforePrint", onBeforePrint);
                        var pos = -1;
                        for (var i = 0, len = listeners.length; i < len; i++) {
                            var currentElement = listeners[i];
                            if (currentElement === element) {
                                pos = i;
                                break;
                            }
                        }
                        if (pos >= 0) {
                            listeners.splice(pos, 1);
                        }
                    });
                };
            }])
        .directive("onAfterPrint", ["$window", "$rootScope", "$timeout", function onAfterPrint($window, $rootScope, $timeout) {
                var afterPrintDirty = false;
                var listeners = [];
                var afterPrint = function () {
                    if (afterPrintDirty)
                        return;
                    afterPrintDirty = true;
                    if (listeners) {
                        for (var i = 0, len = listeners.length; i < len; i++) {
                            listeners[i].triggerHandler("afterPrint");
                        }
                        var scopePhase = $rootScope.$$phase;
                        // This must be synchronious so we call digest here.
                        if (scopePhase != "$apply" && scopePhase != "$digest") {
                            $rootScope.$digest();
                        }
                    }
                    $timeout(function () {
                        // This is used for Webkit. For some reason this gets called twice there.
                        afterPrintDirty = false;
                    }, 100, false);
                };
                if ($window.matchMedia) {
                    var mediaQueryList = $window.matchMedia("print");
                    mediaQueryList.addListener(function (mql) {
                        if (!mql.matches)
                            afterPrint();
                    });
                }
                $window.onafterprint = afterPrint;
                return function (scope, element, attrs) {
                    function onAfterPrint() {
                        $("html").removeClass("print");
                        $timeout(function () {
                            scope.$eval(attrs.onAfterPrint, function (e) {
                                console.log(e);
                                e.stopPropagation();
                            });
                        }, 0);
                    }
                    listeners.push(element);
                    element.on("afterPrint", onAfterPrint);
                    scope.$on("$destroy", function () {
                        element.off("afterPrint", onAfterPrint);
                        var pos = -1;
                        for (var i = 0, len = listeners.length; i < len; i++) {
                            var currentElement = listeners[i];
                            if (currentElement === element) {
                                pos = i;
                                break;
                            }
                        }
                        if (pos >= 0) {
                            listeners.splice(pos, 1);
                        }
                    });
                };
            }])
        .run(["$rootScope", "$timeout", function ($rootScope, $timeout) {
                $rootScope.imageSrc = function (obj) {
                    var img;
                    if (obj && obj.no_image) {
                        img = "";
                    } else if (obj && obj.image === undefined) {
                        img = "/images/" + obj.title.toLowerCase() + ".png";
                    } else if (obj === undefined) {
                        img = null;
                    } else {
                        img = obj.image.toLowerCase();
                    }
                    return img;
                };
                $rootScope.printable = false;
                $rootScope.goToViewTitle = "Go to printable page view";
                $rootScope.changeView = function () {
                    //$rootScope.printable = !$rootScope.printable;
                    //
                    //$(".toggle-no-show").toggleClass("no-show");
                    var tb = $("#table_badges");
                    var tt = $("#table_text");
                    if ($rootScope.goToViewTitle == "Go to printable page view") {
                        $rootScope.printable = true;
                        tb.addClass("no-show");
                        tt.removeClass("no-show");
                    } else {
                        $rootScope.printable = false;
                        tb.removeClass("no-show");
                        tt.addClass("no-show");
                    }
                    //
                    if ($("html").hasClass("print")) {
                        $("html").removeClass("print");
                        $rootScope.printable = false;
                        $rootScope.goToViewTitle = "Go to printable page view";
                    } else {
                        $("html").addClass("print");
                        $rootScope.printable = true;
                        $rootScope.goToViewTitle = "Go to animated page view";
                    }
                    $(document).tooltip({
                        content: function () {
                            return $(this).attr("title");
                        }
                    });
                };
                $rootScope.downloadPDF = function () {
                    window.open("https://github.com/DmitriiSer/Resume/raw/master/docs/dmitriiserikov.resume.pdf", "_blank");
                };
                $rootScope.downloadDOCX = function () {
                    window.open("https://github.com/DmitriiSer/Resume/raw/master/docs/dmitriiserikov.resume.docx", "_blank");
                };
            }])
        .controller("BadgeController", ["$rootScope", "$scope", "$timeout", function ($rootScope, $scope, $timeout) {
                $scope.data = [
                    {
                        col: [
                            {
                                name: "Languages",
                                size: 96,
                                badges: [
                                    {title: "Java", href: "http://www.oracle.com/technetwork/java/javase/overview/index.html"},
                                    {title: "C++", href: "http://www.cplusplus.com/"},
                                    {title: "HTML5", href: "http://www.w3.org/html/"},
                                    {title: "CSS3", href: "http://www.w3.org/Style/CSS/"},
                                    {title: "SASS", href: "http://sass-lang.com/"},
                                    {title: "JavaScript", href: "http://en.wikipedia.org/wiki/JavaScript"}
                                ]
                            }
                        ]
                    },
                    {
                        col: [
                            {
                                name: "Frameworks & Libraries",
                                size: 80/*64*/,
                                width: 100,
                                badges: [
                                    {title: "AngularJS", href: "https://angularjs.org/"},
                                    {title: "Ionic", href: "http://ionicframework.com/"},
                                    {title: "jQuery", href: "https://jquery.com/"},
                                    {title: "Velocity.js", href: "http://julian.com/research/velocity/", no_image: true}
                                ]
                            }
                        ]
                    },
                    {
                        col: [
                            {
                                name: "IDEs",
                                colspan: 2,
                                size: 80,
                                width: 100,
                                badges: [
                                    {title: "NetBeans", href: "https://netbeans.org/"},
                                    {title: "Visual Studio", href: "https://www.visualstudio.com", image: "/images/visualstudio.png"},
                                    {title: "Eclipse", href: "https://eclipse.org/"}
                                ]
                            }
                        ]
                    },
                    {
                        col: [
                            {
                                name: "Familiar with",
                                colspan: 2,
                                size: 96,
                                shape: "square",
                                badges: [
                                    {title: "OOP", href: "http://en.wikipedia.org/wiki/Object-oriented_programming", tooltip: "Object Oriented Principles", no_image: true},
                                    {title: "Design Patterns", href: "https://en.wikipedia.org/wiki/Software_design_pattern", no_image: true},
                                    {title: "MySQL", href: "https://www.mysql.com"},
                                    {title: "SQL Server", href: "https://en.wikipedia.org/wiki/Microsoft_SQL_Server", image: "/images/mssql.png", tooltip: "Microsoft SQL Server"},
                                    {title: "Git", href: "https://git-scm.com/"},
                                    {title: "GitHub", href: "https://github.com/DmitriiSer/"},
                                    {title: "Windows", href: "http://www.microsoft.com/windows/"},
                                    {title: "Mac OS X", href: "http://www.apple.com/osx/", image: "/images/macosx.png"},
                                    {title: "Linux", href: "https://en.wikipedia.org/wiki/Linux"}
                                ]
                            }
                        ]
                    }
                ];
                $scope.updateData = function () {
                    return $scope.data;
                }
                $scope.backgroundStyle = function (badge) {
                    if (badge.no_image) {
                        return "";
                    }
                    else {
                        var img = (badge.image === undefined) ? 'images/' + badge.title.toLowerCase() + '.png' : badge.image;
                        return "background-image: url(" + img + ")";
                    }
                };
                $scope.onBeforePrint = function () {
                    $scope.$apply(function () {
                        $rootScope.printable = true;
                    });
                };
                $scope.onAfterPrint = function () {
                    $scope.$apply(function () {
                        var tb = $("#table_badges");
                        var tt = $("#table_text");
                        if (tb.hasClass("no-show"))
                            tb.removeClass("no-show");
                        if (!tt.hasClass("no-show"))
                            tt.addClass("no-show");
                        $rootScope.goToViewTitle = "Go to printable page view";
                        //$(".toggle-no-show").toggleClass("no-show");
                        $rootScope.printable = false;
                    });
                };
            }])
        .controller("ExperienceController", ["$scope", function ($scope) {
                $scope.data = {
                    role: "Infrastructure Team Leader, Sept 2009 – May 2015",
                    /*Department of Computer Information Systems / Department of Maintaining Servers*/
                    /*automated energy metering systems"",*/
                    key_results: [
                        "Controlled a small team of specialists to provide trouble-free operation of customers' retail servers",
                        "Created plans and schedules to maintain customers' servers",
                        "Organized emergency server maintenance",
                        /*"Verified team members' work",*/
                        /*"Daily checked the system availability",*/
                        /*"Created reports and reported to manager",*/
                        "Controlled software supplies of the branch office",
                        "Maintained on-campus proxy, domain controller, data servers and Kerio WinRoute/Control security products",
                        "Administrated local network of the office"
                    ]
                };
            }])
        .controller("ProjectsController", ["$rootScope", "$scope", function ($rootScope, $scope) {
                $scope.projectsToShow = Infinity;
                $scope.loadMoreProjects = function (howMany) {
                    $scope.projectsToShow += howMany;
                };
                $scope.techTitles = ["Languages", "Frameworks & Libraries", "IDEs", "DBs"];
                $scope.data = [
                    {
                        title: "Lister",
                        link: "https://github.com/DmitriiSer/Lister",
                        tooltip: "Go To GitHub Project Page",
                        description: "Lister is an on-line organizer that is written in HTML5, CSS, JavaScript and Java. It is mobile-ready, native-looking, and backed by AngularJS, Ionic, and Bootstrap frameworks",
                        techs: {
                            langs: [
                                {title: "HTML5"},
                                {title: "CSS3"},
                                {title: "JavaScript"},
                                {title: "Java"}
                            ],
                            libs: [
                                {title: "AngularJS"},
                                {title: "Ionic"},
                                {title: "Bootstrap"},
                                {title: "UI Bootstrap", no_image: true},
                                {title: "Font Awesome", image: "/images/font_awesome.png"},
                                {title: "Velocity.js", no_image: true},
                                {title: "CryptoJS (SHA-3)", image: "/images/CryptoJS.png"},
                                {title: "OpenShift"}
                            ],
                            ides: [{title: "NetBeans"}],
                            dbs: [{title: "MySQL"}]
                        }
                    },
                    {
                        title: "AdvancedCarousel",
                        link: "https://github.com/DmitriiSer/WebProjects/tree/master/AdvancedCarousel",
                        tooltip: "Go To GitHub Project Page",
                        description: "Representation of a HTML image carousel",
                        techs: {
                            langs: [
                                {title: "HTML5"},
                                {title: "CSS3"},
                                {title: "JavaScript"}
                            ],
                            libs: [
                                {title: "jQuery"},
                                {title: "jQuery-UI"},
                                {title: "Velocity.js", no_image: true},
                            ],
                            ides: [{title: "Adobe Brackets 1.3.0", image: "/images/brackets.png"}]
                        }
                    },
                    {
                        title: "Foodnetwork Recipe to Cozi (Browser Extension)",
                        link: "https://github.com/DmitriiSer/WebProjects/tree/master/Chrome%20Extensions/Foodnetwork%20Recipe%20to%20Cozi%20Meals",
                        tooltip: "Go To GitHub Project Page",
                        description: "Chrome/Opera extension that allows you to transfer the whole recipe from Foodnetwork to Cozi Meals by pressing a button in the pop-up window of the extension",
                        techs: {
                            langs: [
                                {title: "HTML5"},
                                {title: "CSS3"},
                                {title: "JavaScript"}
                            ],
                            libs: [],
                            ides: [{title: "Adobe Brackets 1.3.0", image: "/images/brackets.png"}]
                        }
                    },
                    {
                        title: "Resume",
                        link: "https://github.com/DmitriiSer/Resume",
                        tooltip: "Go To GitHub Project Page",
                        description: "Web-based animated version of this resume",
                        techs: {
                            langs: [
                                {title: "HTML5"},
                                {title: "CSS3"},
                                {title: "JavaScript"}
                            ],
                            libs: [
                                {title: "jQuery"},
                                {title: "jQuery-UI"},
                                {title: "AngularJS"},
                                {title: "Velocity.js", no_image: true},
                            ],
                            ides: [{title: "Adobe Brackets 1.3.0", image: "/images/brackets.png"}],
                        }
                    },
                    /*
                     {
                     title: "CheapFly",
                     description: "This on-going project creates an application that would find the cheapest flights around the world using different search engines (e.g. Expedia, RyanAir, etc.). It consist of 2 parts: the server and the client. The server receives request from client app and pushes/fetches entries to DB which is MySQL instance. The client is a desktop application to provide UI to users",
                     techs: {
                     langs: [{title: "C++/CLI (.NET)", no_image: true}],
                     libs: [{title: "Boost (ASIO)", image: "/images/boost_asio.png"}],
                     ides: [{title: "Visual Studio", image: "/images/visualstudio.png"}],
                     dbs: [{title: "MySQL"}],
                     }
                     },
                     {
                     title: "AELS Sniffer",
                     description: "Simple network traffic analyzer",
                     techs: {
                     langs: [{title: "C++"}],
                     libs: [{title: "WinPcap", no_image: true}],
                     ides: [{title: "Borland C++ Builder 5/6", image: "/images/bcb6.png"}]
                     }
                     },
                     {
                     title: "Tetrahedroid",
                     description: "Compound of 2 tetrahedra spinning around its axis. Made on Windows using Visual C++ and DirectX APIs",
                     techs: {
                     langs: [{title: "C++/CLI (.NET)", no_image: true}],
                     libs: [{title: "DirectX (Direct3D)", image: "/images/directx.png"}],
                     ides: [{title: "Visual Studio", image: "/images/visualstudio.png"}]
                     }
                     },
                     {
                     title: "PDFToXLS",
                     description: "Application that allows the user to create XLS spreadsheet file from PDF using an online service. It creates HTTPRequests to that web service, uploads a file and gets the result file back",
                     techs: {
                     langs: [{title: "C++/CLI (.NET)", no_image: true}],
                     libs: [],
                     ides: [{title: "Visual Studio", image: "/images/visualstudio.png"}]
                     }
                     }*/
                ];
            }]);