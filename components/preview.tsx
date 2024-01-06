"use client";

import React from 'react';
import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill/dist/quill.bubble.css";

interface PreviewProps {
  value: string;
};


type Props = {}

export default function Preview({ value }: PreviewProps) {
    const ReactQuill = useMemo(() => dynamic(() => import("react-quill"), { ssr: false }), []);
  return (
    <div className="border-2">
        <ReactQuill
          theme="bubble"
          value={value}
          readOnly
        />
    </div>
  )
}