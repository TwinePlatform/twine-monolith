**GitHub workflow**
- Feature branches created for scheduled release work
- Hotfix branches created and merged directly into master
- PRs to be marked with manual testing requirements
    - check list in body of PR
    - apps to test
    - flows that will be affected
- PRs should be code reviewed first then manually tested. If this process is strung out and other major work has been merged in the meantime, PRs need to be retested.
- PRs should be clearly marked if they are waiting for a release schedule/comms
- [PR Template](./pull_request_template.md)
- on production release PR issue to be moved release column in pipeline

**Deployment workflow**
- Heroku `staging` manually deployed from Github `master`
- As part of merging PRs manually check heroku `staging` build and promote to production. This adds to additional security that any unanticipated issues have not occurred. This is to be done immediately after PR is merged. Changes should not stay in staging. 
- On promotion PRs are marked as deployed to production.
