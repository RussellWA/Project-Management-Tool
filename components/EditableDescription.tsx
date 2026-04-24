"use client";

import { useEffect, useState } from "react";

interface EditableDescriptionProps {
    value: string;
    onChange: (val: string) => void;
}

export default function EditableDescription({value, onChange}: EditableDescriptionProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [temp, setTemp] = useState(value || "Write something...\nSupports multiple lines.");

    useEffect(() => {
        setTemp(value);
    }, [value]);

    return isEditing ? (
        <textarea 
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            onBlur={() => {
                onChange(temp); 
                setIsEditing(false);
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    onChange(temp); 
                    setIsEditing(false);
                }
                if (e.key === "Escape") {
                    setTemp(value);
                    setIsEditing(false);
                }
            }}
            onFocus={(e) => e.target.select()}
            autoFocus
            className="text-sm border border-transparent focus:border-blue-500 focus:outline-none rounded p-1 transition w-full resize-none"
        />
    ) : (
        <p
            onClick={() => setIsEditing(true)}
            className="text-sm text-gray-700 border border-transparent hover:border-gray-600 rounded py-1 px-2 transition cursor-text whitespace-pre-line"
        >
            {value || "Click to add description..."}
        </p>
    )
}