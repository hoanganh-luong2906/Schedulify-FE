import { INotificationResponse, ISendNotification } from "./constants";

const api = process.env.NEXT_PUBLIC_API_URL;

export const getNotification = async (
  sessionToken: string,
  accountId: number
): Promise<INotificationResponse> => {
  try {
    const response = await fetch(`${api}/api/notifications/${accountId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    }
    throw new Error(data.message);
  } catch (error) {
    console.log("API Error:", error);
    throw error;
  }
};

interface UnreadCountResponse {
  status: number;
  message: string;
  result: number;
}

export const getUnreadCount = async (
  sessionToken: string,
  accountId: number
): Promise<number> => {
  const response = await fetch(
    `${api}/api/notifications/${accountId}/number-unread`,
    {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data: UnreadCountResponse = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data.result;
};

export const sendNotificationToAll = async (
  sessionToken: string,
  payload: ISendNotification
): Promise<void> => {
  const response = await fetch(`${api}/api/notifications/send-to-all`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sessionToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

export const markAllNotificationsAsRead = async (
  sessionToken: string,
  accountId: number
) => {
  try {
    const response = await fetch(
      `${api}/api/notifications/mark-all-isread?accountId=${accountId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

export const markNotificationAsRead = async (
  sessionToken: string,
  notificationId: number
) => {
  try {
    const response = await fetch(
      `${api}/api/notifications/${notificationId}/mark-isread`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    
    if (!response.ok) {
      console.error("Error marking notification as read:", data.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return null;
  }
};
