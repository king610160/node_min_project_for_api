const getAllJobs = async (req, res) => {
    res.send(`Get all jobs`)
}

const getJob = async (req, res) => {
    res.send(`Get job`)
}

const createJob = async (req, res) => {
    res.send(`Create jobs`)
}

const updateJob = async (req, res) => {
    res.send(`Update job`)
}

const deleteJobs = async (req, res) => {
    res.send(`Delete jobs`)
}
module.exports = {
    getAllJobs, getJob, createJob, updateJob, deleteJobs
}