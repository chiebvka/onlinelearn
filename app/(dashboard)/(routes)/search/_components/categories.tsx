"use client";


import React from 'react'

import { Category } from "@prisma/client";
import {
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode
} from "react-icons/fc";
import { GiGlobe, GiBanknote } from "react-icons/gi";
import { FaPaintBrush } from "react-icons/fa";
import { MdAddBusiness, MdOutlineVideoCameraBack } from "react-icons/md";
import { RiAdvertisementFill } from "react-icons/ri";
import { TbMathSymbols } from "react-icons/tb";
import { IconType } from "react-icons";
import CategoryItem from './categoryItem';


interface CategoriesProps {
    items: Category[];
  }
  
const iconMap: Record<Category["name"], IconType> = {
"Music": FcMusic,
"Maths": TbMathSymbols,
"Geography": GiGlobe,
"Marketing": RiAdvertisementFill,
"Business": MdAddBusiness,
"Arts": FaPaintBrush,
"Finance": GiBanknote,
"Videography": MdOutlineVideoCameraBack,
"Photography": FcOldTimeCamera,
"Fitness": FcSportsMode,
"Accounting": FcSalesPerformance,
"Computer Science": FcMultipleDevices,
"Filming": FcFilmReel,
"Engineering": FcEngineering,
};
  

export default function Categories({items}: CategoriesProps) {
    
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
              {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  )
}