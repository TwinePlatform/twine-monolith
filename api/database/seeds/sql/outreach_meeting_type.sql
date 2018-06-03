ALTER SEQUENCE outreach_meeting_type_seq RESTART WITH 1;

INSERT INTO outreach_meeting_type
  (meeting_type_name)
VALUES
  ("First contact"),
  ("Follow-up from previous interaction"),
  ("Event");
