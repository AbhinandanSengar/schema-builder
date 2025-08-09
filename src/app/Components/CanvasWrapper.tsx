'use client';

import { useParams } from 'next/navigation';
import Canvas from './Canvas/Canvas';

export default function CanvasWrapper() {
    const params = useParams();
    let projectId = params.projectId;

    if (!projectId) {
        return <div>Project ID is missing</div>;
    }

    if (Array.isArray(projectId)) {
        projectId = projectId[0];
    }

    return <Canvas projectId={projectId} />;
}
