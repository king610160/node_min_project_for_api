const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError, NoPermissionError } = require('../errors')

const getAllJobs = async (req, res) => {
    const jobs = await Job
        .find({ createdBy: req.user.userId })
        .sort('createdAt')
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const getJob = async (req, res) => {
    const id = req.params.id
    const job = await Job.findById(id)
    if (!job) throw new NotFoundError(`There is no job with ${id}`)

    const userId = req.user.userId

    if (userId !== String(job.createdBy)) throw new NoPermissionError('You have no permission to enter the page.')
    res.status(StatusCodes.OK).json({ job })
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const result = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json(result)
}

const updateJob = async (req, res) => {
    const { company, position } = req.body
    if (!company || !position) throw new BadRequestError('Need to enter with company and postion.')

    const _id = req.params.id
    const userId = req.user.userId

    const job = await Job.findOneAndUpdate( 
        { _id, createdBy: userId }, 
        req.body, 
        {new: true, runValidators: true}
    )
    if (!job) throw new NotFoundError(`There is no job with ${_id}`)
    
    res.status(StatusCodes.OK).json({ job })
}

const deleteJobs = async (req, res) => {
    const _id = req.params.id
    const userId = req.user.userId

    const job = await Job.findOneAndRemove( 
        { _id, createdBy: userId }
    )
    if (!job) throw new NotFoundError(`There is no job with ${_id}`)
    res.status(StatusCodes.OK).json({ deleteJob: job })
}
module.exports = {
    getAllJobs, getJob, createJob, updateJob, deleteJobs
}