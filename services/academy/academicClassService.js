import { AcademyClass } from "../../models/AcademyModel.js";
import { NotFoundError } from "../../errors/customError.js";


export const _loadAcademicClass = async (query, page, size) => {
    try{
        const skip = (page-1) *  size;

        const data = await AcademyClass.find(query).skip(skip).limit(size);

        const totalCount = await AcademyClass.countDocuments(query);
        const totalPage = Math.ceil(totalCount / size);

        if (!data) {
            throw new NotFoundError('Academic class not found')
        }

        return {data, totalCount, totalPage, currentPage:page};

    }catch(error){
        throw new Error(error.message);
    }
}