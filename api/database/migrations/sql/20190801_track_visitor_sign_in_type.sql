/*
 * Track sign in type on visitor app
 */

-- NB: will need editing if batch login is implemented

CREATE TYPE ENUM_visitor_log_attendance_type AS ENUM ('sign_in_with_name', 'qr_code');

CREATE TABLE visit_log_attendance (
  visit_log_attendance_id   SERIAL NOT NULL UNIQUE,
  visit_log_id              INT NOT NULL,
  attendance_type           ENUM_visitor_log_attendance_type,
  created_at                TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at               TIMESTAMP WITH TIME ZONE,
  deleted_at                TIMESTAMP WITH TIME ZONE,

  CONSTRAINT visit_log_attendance_pk                 PRIMARY KEY (visit_log_attendance_id),
  CONSTRAINT visit_log_attendance_to_visit_log_fk    FOREIGN KEY (visit_log_id) REFERENCES visit_log ON DELETE CASCADE
);
