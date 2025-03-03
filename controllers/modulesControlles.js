import { Module } from "../models/CourseModel.js";
import { _loadModules } from "../services/moduleService.js";

export const loadModules = async (req, res) => {
    try {
        const data = await _loadModules();

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch modues", error: error.message });
    }
}

export const getModule = async (req, res) => {
    try {
        const moduleId = req.params.id;
        if(!moduleId){
            return res.status(400).json({ message: "Invalid module id", error: error.message });
        }

        const module = await Module.findById(moduleId);

        if(!module){
            return res.status(404).json({ message: "Failed to fetch modues", error: error.message });
        }

        res.status(200).json(module);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch modues", error: error.message });
    }
}

export const createModule = async (req, res) => {
    try {
        // const data = await _loadModules();

        const module = req.body;

        if (module._id) {
            await Module.findByIdAndUpdate(module._id, module);
            res.status(200).json('update success');
        }
        else {
            await Module.create(module)
            res.status(200).json('create success');
        }


    } catch (error) {
        res.status(500).json({ message: "Failed to fetch modues", error: error.message });
    }
}