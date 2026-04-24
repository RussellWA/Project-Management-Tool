"use client";

import { useEffect, useState } from "react";

interface EditableTitleProps {
    value: string;
    onChange: (val: string) => void;
}

export default function EditableTitle({value, onChange}: EditableTitleProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [temp, setTemp] = useState(value);

    useEffect(() => {
        setTemp(value);
    }, [value]);

    return isEditing ? (
        <input 
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
            className="border border-transparent focus:border-blue-500 focus:outline-none rounded p-1 transition min-w-100"
        />
    ) : (
        <p
            onClick={() => setIsEditing(true)}
            className="font-bold text-gray-800 text-lg border border-transparent hover:border-gray-300 rounded p-1 transition cursor-pointer w-fit inline-block"
        >
            {value || "Untitled"}
        </p>
    )
}