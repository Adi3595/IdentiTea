"use client"

import { useCallback, useState } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

const initialNodes = [
  { id: '1', position: { x: 250, y: 150 }, data: { label: 'You (Student)' }, style: { background: '#7C3AED', color: 'white', borderRadius: '50%', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
  { id: '2', position: { x: 100, y: 300 }, data: { label: 'React.js' }, style: { background: '#22C55E', color: 'white', borderRadius: '10px' } },
  { id: '3', position: { x: 400, y: 300 }, data: { label: 'Python' }, style: { background: '#22C55E', color: 'white', borderRadius: '10px' } },
  { id: '4', position: { x: 100, y: 450 }, data: { label: 'Frontend Dashboard' }, style: { background: '#3b82f6', color: 'white', borderRadius: '10px' } },
]

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', label: 'KNOWS', animated: true, style: { stroke: '#7C3AED' } },
  { id: 'e1-3', source: '1', target: '3', label: 'KNOWS', animated: true, style: { stroke: '#7C3AED' } },
  { id: 'e2-4', source: '2', target: '4', label: 'USED_IN', style: { stroke: '#22C55E' } },
]

export default function KnowledgeGraphPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Your Knowledge Graph</h1>
        <p className="text-muted-foreground mt-1">
          Explore how your skills, projects, and experiences connect to form your professional identity.
        </p>
      </div>
      
      <div className="flex-1 border border-border/50 rounded-2xl overflow-hidden bg-black/5 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          colorMode="dark"
        >
          <Controls />
          <MiniMap nodeColor={(n) => {
            if (n.style?.background) return n.style.background as string;
            return '#fff';
          }} />
          <Background color="#7C3AED" gap={16} size={1} />
        </ReactFlow>
      </div>
    </div>
  )
}
