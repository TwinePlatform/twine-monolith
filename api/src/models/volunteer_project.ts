import { filter } from 'ramda';
import { VolunteerProjectCollection } from './types';


export const VolunteerProjects: VolunteerProjectCollection = {
  getDefault(cb) {
    return {
      id: 0,
      organisationId: cb.id,
      name: 'General',
      createdAt: cb.createdAt,
      modifiedAt: null,
      deletedAt: null,
    };
  },

  async fromCommunityBusiness (client, cb) {
    return client('volunteer_project')
      .select({
        id: 'volunteer_project_id',
        organisationId: 'organisation_id',
        name: 'volunteer_project_name',
        createdAt: 'created_at',
        modifiedAt: 'modified_at',
        deletedAt: 'deleted_at',
      })
      .where({
        organisation_id: cb.id,
        deleted_at: null,
      });
  },

  async add (client, cb, name) {
    const { rows: [{ exists }] } = await client.raw('SELECT EXISTS ?', [
      client('volunteer_project')
        .select()
        .where({ organisation_id: cb.id, deleted_at: null, volunteer_project_name: name }),
    ]);

    if (exists) {
      throw new Error('Cannot add duplicate project');
    }

    const [project] = await client('volunteer_project')
      .insert({
        organisation_id: cb.id,
        volunteer_project_name: name,
      })
      .returning([
        'volunteer_project_id AS id',
        'organisation_id AS organisationId',
        'volunteer_project_name AS name',
        'created_at AS createdAt',
        'modified_at AS modifiedAt',
        'deleted_at AS deletedAt',
      ]);

    return project;
  },

  async update (client, project, changeset) {
    if (changeset.name) {
      const { rows: [{ exists }] } = await client.raw('SELECT EXISTS ?', [
        client('volunteer_project')
          .select()
          .where({
            organisation_id: project.organisationId,
            deleted_at: null,
            volunteer_project_name: changeset.name,
          })
          .whereNot({ volunteer_project_id: project.id }),
      ]);

      if (exists) {
        throw new Error('Project name is a duplicate');
      }
    }

    return client('volunteer_project')
      .update(filter((a) => typeof a !== 'undefined', {
        volunteer_project_name: changeset.name,
        organisation_id: changeset.organisationId,
        deleted_at: changeset.deletedAt,
      }))
      .where(filter((a) => typeof a !== 'undefined', {
        volunteer_project_id: project.id,
        volunteer_project_name: project.name,
        organisation_id: project.organisationId,
        deleted_at: project.deletedAt,
      }))
      .returning([
        'volunteer_project_id AS id',
        'organisation_id AS organisationId',
        'volunteer_project_name AS name',
        'created_at AS createdAt',
        'modified_at AS modifiedAt',
        'deleted_at AS deletedAt',
      ]);
  },

  async delete (client, project) {
    return client.transaction(async (trx) => {
      const rows = await VolunteerProjects.update(
        trx,
        project,
        { deletedAt: new Date().toISOString() }
      );

      await trx('volunteer_hours_log')
        .update({ volunteer_project_id: null })
        .where({ volunteer_project_id: project.id });

      return rows.length;
    });
  },
}
