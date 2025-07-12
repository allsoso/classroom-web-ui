import { api } from '../../lib/axios';

export async function createClassroom(classroomData) {
    const response = await api.post('classroom', classroomData);
    return response.data;
}
