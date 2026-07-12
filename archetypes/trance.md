---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
draft: true
translationKey: "trance-{{ .File.ContentBaseName }}"
artist: ""
entry_type: "Live set"
genre: ""
year: {{ now.Year }}
duration: ""
youtube_url: ""
favourite: false
summary: ""
tags: []
---

Add a short personal note about why this is worth finding again.
