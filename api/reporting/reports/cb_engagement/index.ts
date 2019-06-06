import activeVisitorsProportionReport from './active_visitors_proportion';
import activeVisitorsTotalReport from './active_visitors_total';
import activeVolunteersProportionReport from './active_volunteers_proportion';
import activeVolunteersTotalReport from './active_volunteers_total';
import overviewReport from './overview';
import visitLogsReport from './visit_logs';
import volunteerLogsReport from './volunteer_logs';


export default async () => {
  await activeVisitorsProportionReport();
  await activeVisitorsTotalReport();
  await activeVolunteersProportionReport();
  await activeVolunteersTotalReport();
  await overviewReport();
  await visitLogsReport();
  await volunteerLogsReport();
};
