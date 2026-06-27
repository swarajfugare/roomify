const PROJECT_PREFIX = 'roomify_project_';
const PUBLIC_PROJECT_PREFIX = 'roomify_public_project_';

const jsonError = (status, message, extra = {}) => {
    return new Response(JSON.stringify({  error: message, ...extra }), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
}

const getUserId = async (userPuter) => {
    try {
        const user = await userPuter.auth.getUser();

        return user?.uuid || null;
    } catch {
        return null;
    }
}

router.post('/api/projects/save', async ({ request, user }) => {
    try {
        const userPuter = user.puter;

        if(!userPuter) return jsonError(401, 'Authentication failed');

        const body = await request.json();
        const project = body?.project;
        const visibility = body?.visibility || 'private';

        if(!project?.id || !project?.sourceImage) return jsonError(400, 'Project ID and source image are required');

        const userId = await getUserId(userPuter);
        if(!userId) return jsonError(401, 'Authentication failed');

        const payload = {
            ...project,
            ownerId: userId,
            sharedBy: userId,
            sharedAt: new Date().toISOString(),
            isPublic: visibility === 'public',
            updatedAt: new Date().toISOString(),
        }

        if (visibility === 'public') {
            const publicKey = `${PUBLIC_PROJECT_PREFIX}${project.id}`;
            await puter.kv.set(publicKey, payload);
        } else {
            const privateKey = `${PROJECT_PREFIX}${project.id}`;
            await userPuter.kv.set(privateKey, payload);
        }

        return { saved: true, id: project.id, project: payload }
    } catch (e) {
        return jsonError(500, 'Failed to save project', { message: e.message || 'Unknown error' });
    }
})

router.get('/api/projects/list', async ({ user }) => {
    try {
        const publicProjects = (await puter.kv.list(PUBLIC_PROJECT_PREFIX, true))
            .map(({value}) => ({ ...value, isPublic: true }));

        if (!user?.puter) {
            return { projects: publicProjects };
        }

        const userPuter = user.puter;
        const privateProjects = (await userPuter.kv.list(PROJECT_PREFIX, true))
            .map(({value}) => ({ ...value, isPublic: false }));

        const projectsMap = new Map();
        publicProjects.forEach((project) => projectsMap.set(project.id, project));
        privateProjects.forEach((project) => projectsMap.set(project.id, project));

        return { projects: Array.from(projectsMap.values()) };
    } catch (e) {
        return jsonError(500, 'Failed to list projects', { message: e.message || 'Unknown error' });
    }
})

router.get('/api/projects/public', async () => {
    try {
        const projects = (await puter.kv.list(PUBLIC_PROJECT_PREFIX, true))
            .map(({value}) => ({ ...value, isPublic: true }));

        return { projects };
    } catch (e) {
        return jsonError(500, 'Failed to list public projects', { message: e.message || 'Unknown error' });
    }
})

router.get('/api/projects/get', async ({ request, user }) => {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) return jsonError(400, 'Project ID is required');

        let project = null;

        if (user?.puter) {
            const userPuter = user.puter;
            const privateKey = `${PROJECT_PREFIX}${id}`;
            project = await userPuter.kv.get(privateKey);
        }

        if (!project) {
            const publicKey = `${PUBLIC_PROJECT_PREFIX}${id}`;
            project = await puter.kv.get(publicKey);
        }

        if (!project) return jsonError(404, 'Project not found');

        return { project };
    } catch (e) {
        return jsonError(500, 'Failed to get project', { message: e.message || 'Unknown error' });
    }
})