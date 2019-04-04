// require('jest');

require('./www/lib/ionic/js/ionic.bundle.js');
require('angular-mocks');

require('./www/js/libs/ngStorage.min.js');
require('./www/js/libs/jquery-3.1.0.min.js');
require('./www/js/libs/Chart.min.js');
require('./www/lib/ionicuirouter/ionicUIRouter.js');

require('./www/js/app');
require('./www/js/services/utilities-service');
require('./www/js/services/api-service');
require('./www/js/services/click-preventer-service');
require('./www/js/services/shout-service');
require('./www/js/services/offline-service');
require('./www/js/controllers/register-controller.js');
require('./www/js/controllers/login-controller.js');
require('./www/js/controllers/dashboard-controller.js');
require('./www/js/controllers/new-log-controller.js');
require('./www/js/controllers/new-project-log-controller.js');
require('./www/js/controllers/edit-project-controller.js');
require('./www/js/controllers/view-logs-hours-controller.js');
require('./www/js/controllers/view-logs-projects-controller.js');
require('./www/js/controllers/edit-log-controller.js');
require('./www/js/controllers/settings-controller.js');
require('./www/js/controllers/profile-controller.js');
require('./www/js/controllers/debug-controller.js');
require('./www/js/controllers/view-volunteers-controller.js');
require('./www/js/controllers/new-volunteer-controller.js');
require('./www/js/controllers/edit-volunteer-controller.js');
require('./www/js/routes.js');
require('./www/js/directives.js');
require('./www/js/filters.js');
