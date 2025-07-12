import { api } from '../../lib/axios';

export async function getClassroomStudents(classroomId) {
    const response = await api.get(`classroom/${classroomId}/students`);
    return response.data;
}
