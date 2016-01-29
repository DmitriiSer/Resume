var app = angular.module("Resume", [])
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
        .run(["$rootScope", function ($rootScope) {
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
            }])
        .controller("BadgeController", ["$rootScope", "$scope", function ($rootScope, $scope) {
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
                                    {title: "JavaScript", href: "http://en.wikipedia.org/wiki/JavaScript"}
                                ]
                            },
                            {
                                name: "Frameworks & Libraries",
                                size: 64,
                                width: 200,
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
                                colspan: 1,
                                size: 72,
                                width: 200,
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
                $scope.backgroundStyle = function (badge) {
                    if (badge.no_image) {
                        return "";
                    }
                    else {
                        var img = (badge.image === undefined) ? 'images/' + badge.title.toLowerCase() + '.png' : badge.image;
                        return "background-image: url(" + img + ")";
                    }
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
                        description: "Lister is an on-line organizer that is written in HTML5, CSS, JavaScript and is mobile-ready, natively looking, and backed by AngularJS and Ionic Fraeworks",
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
                        title: "Foodnetwork Recipe to Cozi Meals (Google Chrome/Opera Extension)",
                        link: "https://github.com/DmitriiSer/WebProjects/tree/master/Chrome%20Extensions/Foodnetwork%20Recipe%20to%20Cozi%20Meals",
                        tooltip: "Go To GitHub Project Page",
                        description: "Chrome/Opera extension that allows you to transfer the whole recipe from Foodnetwork recipe page to Cozi Meals recipe by pressing a button in the popup window of the extension",
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
                        link: "https://github.com/DmitriiSer/WebProjects/tree/master/Resume",
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
                    {
                        title: "CheapFly",
                        description: "This on-going project creates an application that would find the cheapest flights around the world using different search engines (e.g Expedia, RyanAir, etc.). It consist of 2 parts: the server and the client. The server receives request from client app and pushs/fetches entries to DB which is MySQL instance. The client is a desktop application to provide UI to users",
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
                        title: "Tetraedroid",
                        description: "Compound of 2 tetrahedra spinning around it's axis. Made on Windows using Visual C++ and DriectX APIs",
                        techs: {
                            langs: [{title: "C++/CLI (.NET)", no_image: true}],
                            libs: [{title: "DirectX (Direct3D)", image: "/images/directx.png"}],
                            ides: [{title: "Visual Studio", image: "/images/visualstudio.png"}]
                        }
                    },
                    {
                        title: "PDFToXLS",
                        description: "Application that allowes the user to create XLS spreadsheet file from PDF using an online service. It creates HTTPRequests to that web service, uploads a file and gets the result file back",
                        techs: {
                            langs: [{title: "C++/CLI (.NET)", no_image: true}],
                            libs: [],
                            ides: [{title: "Visual Studio", image: "/images/visualstudio.png"}]
                        }
                    }
                ];
            }]);