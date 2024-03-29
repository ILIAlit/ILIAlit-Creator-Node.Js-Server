const { model } = require('../db')
const Publication = require('../models/publicationModel')
const Tag = require('../models/tagModel')
const User = require('../models/userModel')
const sequelize = require('../db')

class PublicationRepository {
	async createPublication(publData) {
		const publication = await Publication.create(publData)
		return publication
	}

	async getUserPublications(userId, limit, offset) {
		const publications = await Publication.findAndCountAll({
			where: { userId },
			limit,
			offset,
			include: [{ model: User, attributes: ['name'] }],
		})
		return publications
	}

	async getOnePublication(id) {
		const publication = await Publication.findByPk(id, {
			include: [{ model: User, attributes: ['name'] }],
		})
		return publication
	}

	async getPublicationsByTag(tagId, limit, offset) {
		const publications = await Publication.findAndCountAll({
			limit,
			offset,
			include: [
				{
					model: Tag,
					where: { id: tagId },
				},
				{ model: User, attributes: ['name'] },
			],
		})
		return publications
	}

	async getPublications(limit, offset) {
		const publications = await Publication.findAndCountAll({
			order: [
				['likeCount', 'DESC'],
				['id', 'ASC'],
			],
			limit,
			offset,
			include: [{ model: User, attributes: ['name'] }],
		})
		return publications
	}

	async getNewPublicationsByTag(tagId, limit, offset) {
		const publications = await Publication.findAndCountAll({
			order: [
				['createdAt', 'DESC'],
				['id', 'ASC'],
			],
			limit,
			offset,
			include: [
				{
					model: Tag,
					where: { id: tagId },
				},
				{ model: User, attributes: ['name'] },
			],
		})
		return publications
	}

	async getNewPublications(limit, offset) {
		const publications = await Publication.findAndCountAll({
			order: [
				['createdAt', 'DESC'],
				['id', 'ASC'],
			],
			limit,
			offset,
			include: [{ model: User, attributes: ['name'] }],
		})
		return publications
	}

	async addPublicationTag(tag, publication) {
		await publication.addTag(tag)
	}

	async incrementLikeCount(publication) {
		await publication.increment('likeCount')
		await publication.save()
	}

	async decrementLikeCount(publication) {
		await publication.decrement('likeCount')
		await publication.save()
	}
}

module.exports = new PublicationRepository()
