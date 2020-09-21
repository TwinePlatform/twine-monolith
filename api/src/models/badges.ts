import * as Knex from 'knex';


export const badges = {

	async getName(client: Knex, orgId: any) {
		const res = await client('user_account')
			.select('user_name')
			.whereIn('user_account_id', orgId)

		return res;
	},

	async getVolunteersNames(client: Knex, userId: any) {

		const res = await client('user_account')
			.select('user_name', 'user_account_id')
			.whereIn('user_account_id', userId)

		return res;
	},

	async getAwards(client: Knex, orgId: number, userId?: number) {

		if (userId == undefined) {
			const res = await client('user_badges')
				.select('award_id', 'user_account_id')
				.where({
					'organisation_id': orgId
				})
				.orderBy('achieved_date');
			//ToDo: sort acheived date

			return res;
		} else {
			const res = await client('user_badges')
				.select('award_id')
				.where({
					'user_account_id': userId,
					'organisation_id': orgId
				})
				.orderBy('achieved_date');
			//ToDo: sort acheived date

			return res;
		}
	},

	async updateAwards(client: Knex, userId: number, orgId: number, awardId: number) {

		const res = await client('user_badges')
			.insert({ 'user_account_id': userId, 'organisation_id': orgId, 'award_id': awardId });

		return res;
	},

	async checkInvitationBadge(client: Knex, userId: any, orgId: number, awardId: number) {
		const [res] = await client('user_badges')
			.select()
			.where({
				'user_account_id': userId,
				'organisation_id': orgId,
				'award_id': awardId
			});

		return res || null;

	},

	async checkLoggedHours(client: Knex, userId: any, orgId: number) {

		const res = await client('sum_logged_hour')
			.select('total_duration')
			.where({
				'user_account_id': userId,
				'organisation_id': orgId
			});

		return res;

	},

	async checkNumLog(client: Knex, userId: any, orgId: number) {

		const res = await client('total_num_logged')
			.select('num_logs')
			.where({
				'user_account_id': userId,
				'organisation_id': orgId
			});

		return res;

	},

}