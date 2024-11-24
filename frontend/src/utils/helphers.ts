export const storeDescriptionInLocalStorage = (id: number, description: string) => {
    localStorage.setItem(`dataset-description-${id}`, description);
  };
  
export const getDescriptionFromLocalStorage = (id: number): string | null => {
    return localStorage.getItem(`dataset-description-${id}`);
};

export const formatCreationTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);

    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
};