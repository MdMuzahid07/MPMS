"use client";

import { useState } from "react";
import { mockData } from "@/data/mockData";
import { Task, Comment, ActivityLog, TaskStatus } from "@/types/domain";

export function useMyTaskDetails(sprintId: string, taskId: string) {
  const [task, setTask] = useState<Task | undefined>(() =>
    sprintId && taskId ? mockData.getTaskById(sprintId, taskId) : undefined,
  );
  const [comments, setComments] = useState<Comment[]>(() => {
    if (!sprintId || !taskId) return [];
    return mockData.getTaskById(sprintId, taskId)?.comments || [];
  });
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() =>
    taskId ? mockData.getActivityLogs(taskId) : [],
  );

  // Sync state synchronously when props change
  const [prevTaskKey, setPrevTaskKey] = useState(`${sprintId}-${taskId}`);
  const currentKey = `${sprintId}-${taskId}`;
  if (currentKey !== prevTaskKey) {
    setPrevTaskKey(currentKey);
    const t = mockData.getTaskById(sprintId, taskId);
    setTask(t);
    setComments(t?.comments || []);
    setActivityLogs(mockData.getActivityLogs(taskId));
  }

  const handleAddComment = (content: string) => {
    if (!content.trim()) return;
    const newComment = mockData.addCommentToTask(sprintId, taskId, content);
    if (newComment) {
      // Reload from mockData state cleanly
      const t = mockData.getTaskById(sprintId, taskId);
      if (t) {
        setTask(t);
        setComments(t.comments || []);
      }
      const logs = mockData.getActivityLogs(taskId);
      setActivityLogs(logs);
    }
  };

  const handleLikeComment = (commentId: string) => {
    const success = mockData.likeCommentInTask(sprintId, taskId, commentId);
    if (success) {
      // Reload comments state
      const t = mockData.getTaskById(sprintId, taskId);
      if (t) {
        setComments(t.comments || []);
      }
    }
  };

  const handleUpdateStatus = (newStatus: TaskStatus) => {
    const success = mockData.updateTaskStatus(sprintId, taskId, newStatus);
    if (success) {
      const t = mockData.getTaskById(sprintId, taskId);
      setTask(t);
      const logs = mockData.getActivityLogs(taskId);
      setActivityLogs(logs);
    }
  };

  return {
    task,
    comments,
    activityLogs,
    handleAddComment,
    handleLikeComment,
    handleUpdateStatus,
  };
}
