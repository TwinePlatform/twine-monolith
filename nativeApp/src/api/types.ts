import { Api } from '../../../api/src/api/v1/types/api';

export type NewVolunteer = Api.Users.Register.Volunteers.POST.Request['payload']

export type CurrentUser = Api.Users.Me.Roles.GET.Result
