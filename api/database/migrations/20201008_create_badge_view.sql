/*
 * Migration template
 */
Create VIEW sum_logged_hour AS 
    SELECT organisation_id,user_account_id, sum(duration) as total_duration 
    FROM public.volunteer_hours_log group by user_account_id, organisation_id  order by total_duration;

Create VIEW total_num_logged AS  
    SELECT organisation_id,user_account_id, count(volunteer_hours_log_id) as num_logs 
    FROM public.volunteer_hours_log group by user_account_id, organisation_id order by num_logs;

CREATE TABLE user_badges(
    Volunteer_award_id SERIAL PRIMARY KEY ,
    user_account_id  INT NOT NULL, 
    organisation_id  INT NOT NULL, 
    award_id INT  NOT NULL, 
    achieved_date  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
    unique (user_account_id, organisation_id, award_id)
);