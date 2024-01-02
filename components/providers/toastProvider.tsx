"use client"

import React from 'react';
import { Toaster } from "react-hot-toast"

type Props = {}

export default function ToastProvider({}: Props) {
  return (
    <Toaster />
  )
}