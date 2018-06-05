TRUNCATE outreach_meeting_type RESTART IDENTITY;

INSERT INTO outreach_meeting_type
  (meeting_type_name)
VALUES
  ("First contact"),
  ("Follow-up from previous interaction"),
  ("Event");
