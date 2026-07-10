import React from "react";

export interface MenuItem {
    text: string;
    icon: string;
    path: string;
    subMenu?: string[];
  }