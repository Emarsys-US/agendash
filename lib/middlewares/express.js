'use strict';
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

module.exports = agendash => {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use('/', express.static(path.join(__dirname, '../../public')));

    app.get('/api', (req, res) => {
        agendash.api(req.query.job, req.query.state, (err, apiResponse) => {
            if (err) {
                return res.status(400).json(err);
            }
            res.json(apiResponse);
        });
    });

    app.post('/api/jobs/run', (req, res) => {
        agendash.runJobs(req.body.jobIds, (err, newJobs) => {
            if (err || !newJobs) {
                return res.status(500).json(err);
            }
            res.json(newJobs);
        });
    });

    app.post('/api/jobs/requeue', (req, res) => {
        agendash.requeueJobs(req.body.jobIds, (err, newJobs) => {
            if (err || !newJobs) {
                return res.status(500).json(err);
            }
            res.json(newJobs);
        });
    });

    app.post('/api/jobs/unlock', (req, res) => {
        agendash.unlockJobs(req.body.jobIds, (err, unlockedJobs) => {
            if (err || !unlockedJobs) {
                return res.status(500).json(err);
            }
            res.json(unlockedJobs);
        });
    });

    app.post('/api/jobs/enable', (req, res) => {
        agendash.enableJobs(req.body.jobIds, (err, jobs) => {
            if (err || !jobs) {
                return res.status(500).json(err);
            }
            res.json(jobs);
        });
    });

    app.post('/api/jobs/disable', (req, res) => {
        agendash.disableJobs(req.body.jobIds, req.body.jobDisableReason, (err, jobs) => {
            if (err || !jobs) {
                return res.status(500).json(err);
            }
            res.json(jobs);
        });
    });

    app.post('/api/jobs/delete', (req, res) => {
        agendash.deleteJobs(req.body.jobIds, err => {
            if (err) {
                return res.status(500).json(err);
            }
            return res.json({deleted: true});
        });
    });

    app.post('/api/jobs/create', (req, res) => {
        agendash.createJob(req.body.jobName, req.body.jobSchedule, req.body.jobRepeatEvery, req.body.jobData, err => {
            if (err) {
                return res.status(500).json(err);
            }
            return res.json({created: true});
        });
    });

    return app;
};
