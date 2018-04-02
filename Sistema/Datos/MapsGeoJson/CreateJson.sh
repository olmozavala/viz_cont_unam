#!/bin/bash
ogr2ogr -f GeoJSON -t_srs EPSG:4326 vialidades.json ../Map/Vialidades.shp
ogr2ogr -f GeoJSON -t_srs EPSG:4326 perimetro.json ../Map/PerimetroCU.shp
ogr2ogr -f GeoJSON -t_srs EPSG:4326 fueracu.json ../Map/FueraCU.shp
ogr2ogr -f GeoJSON -t_srs EPSG:4326 espaciosabiertos.json ../Map/EspaciosAbiertos.shp
ogr2ogr -f GeoJSON -t_srs EPSG:4326 edificios.json ../Map/Edificios.shp
ogr2ogr -f GeoJSON -t_srs EPSG:4326 deportivas.json ../Map/AreasDeportivas2.shp
