// storage/Vault.js
// Copyright 2026 Conéctate Soluciones y Aplicaciones SL under the Apache License, Version 2.0.

import * as SQLite from 'expo-sqlite';

let dbPromise = null; // Use a promise to manage the singleton connection

/**
 * Gets the database instance safely and asynchronously.
 * Opens the connection only the first time it's needed.
 */
const getDb = () => {
    if (dbPromise === null) {
        console.log("[Vault] Opening database connection (async)...");
        dbPromise = SQLite.openDatabaseAsync('vault.db');
    }
    return dbPromise;
};

/**
 * Initializes the Vault. Creates the 'jobs' table if it doesn't exist.
 */
export const initialize = async () => {
    try {
        const db = await getDb();
        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS jobs (
                id TEXT PRIMARY KEY NOT NULL,
                profileId TEXT NOT NULL,
                jwe TEXT NOT NULL,
                status TEXT NOT NULL,
                locationUrl TEXT
            );
        `);
        console.log("[Vault] Database and 'jobs' table are ready.");
    } catch (error) {
        console.error("[Vault] Error initializing database:", error);
        throw error;
    }
};

/**
 * Saves a job. If it already exists, it will be replaced.
 */
export const saveJob = async (job) => {
    try {
        const db = await getDb();
        const result = await db.runAsync(
            "INSERT OR REPLACE INTO jobs (id, profileId, jwe, status, locationUrl) VALUES (?, ?, ?, ?, ?);",
            job.id, job.profileId, job.jwe, job.status, job.locationUrl || null
        );
        console.log(`[Vault] Job saved: { id: ${job.id}, profileId: ${job.profileId}, status: ${job.status} }`);
        return result;
    } catch (error) {
        console.error(`[Vault] Error saving job with id: ${job.id}`, error);
        throw error;
    }
};

/**
 * Retrieves a full job by its ID.
 */
export const getJob = async (id, profileId) => {
    try {
        const db = await getDb();
        const firstRow = await db.getFirstAsync("SELECT * FROM jobs WHERE id = ? AND profileId = ?;", id, profileId);
        if (firstRow) {
            console.log(`[Vault] getJob for ${id}: found for this profile.`);
        } else {
            console.log(`[Vault] getJob for ${id}: not found for this profile.`);
        }
        return firstRow || null;
    } catch (error) {
        console.error(`[Vault] Error getting job with id: ${id}`, error);
        throw error;
    }
};

/**
 * Retrieves all jobs that match a specific status.
 */
export const getJobsByStatus = async (status, profileId) => {
    try {
        const db = await getDb();
        const allRows = await db.getAllAsync("SELECT * FROM jobs WHERE status = ? AND profileId = ?;", status, profileId);
        console.log(`[Vault] getJobsByStatus for ${status}: found ${allRows.length} rows for profile ${profileId}.`);
        return allRows;
    } catch (error) {
        console.error(`[Vault] Error getting jobs with status: ${status}`, error);
        throw error;
    }
};

/**
 * Updates only the status of an existing job.
 */
export const updateJobStatus = async (id, newStatus, profileId = null) => {
    try {
        const db = await getDb();
        const result = profileId
            ? await db.runAsync("UPDATE jobs SET status = ? WHERE id = ? AND profileId = ?;", newStatus, id, profileId)
            : await db.runAsync("UPDATE jobs SET status = ? WHERE id = ?;", newStatus, id);
        if (result.changes > 0) {
            console.log(`[Vault] Status updated to '${newStatus}' for job with id: ${id}`);
        }
        return result;
    } catch (error) {
        console.error(`[Vault] Error updating status for job with id: ${id}`, error);
        throw error;
    }
};

/**
 * Deletes a job from the database by its ID.
 */
export const deleteJob = async (id) => {
    try {
        const db = await getDb();
        const result = await db.runAsync("DELETE FROM jobs WHERE id = ?;", id);
        if (result.changes > 0) {
            console.log(`[Vault] Job deleted: id ${id}`);
        } else {
            console.log(`[Vault] No job found with id ${id} to delete.`);
        }
        return result;
    } catch (error) {
        console.error(`[Vault] Error deleting job with id: ${id}`, error);
        throw error;
    }
};

/**
 * Retrieves all jobs from the database.
 */
export const getAllJobs = async () => {
    try {
        const db = await getDb();
        const allRows = await db.getAllAsync("SELECT * FROM jobs;");
        console.log(`[Vault] getAllJobs: found ${allRows.length} total jobs.`);
        return allRows;
    } catch (error) {
        console.error(`[Vault] Error getting all jobs:`, error);
        throw error;
    }
};


// This function has been removed to prevent accidental data loss in development.
// To reset the database, manually clear application data.
