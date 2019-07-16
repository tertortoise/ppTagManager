# Preface
The app is partially inspired by https://ant.design/components/tree-select. Primary objective of this app is to produce a multi-tier set of tags (categories) that can be assigned to entries (simple todo items, posts, goods etc):
- one can assign more than one tag to an entry,
- one can assign not only a leaf to an entry, but a node tag as well,
- tags may be edited, created and deleted (backend check makes sure that deleted tag is not assigned to an entry),
- if entries are filtered by a node tag, all entries with tag-descendants (node and leaves alike) are picked by this filter condition.

## Main
Filter entries by:
- tags
- dates
- status and importance

Edit and delete actions are triggered by buttons in entries.

## New entry
Simple form to make a new entry.
Validation mechanism allows adding new entry if at least one tag is chosen, entry title and date are present.

## Tag editor
New tag - make new level 1 tag.
Each tag in tree like expanding menu has 3 buttons: edit, delete and new descendant tag.
Validation: (a) each tag should have a title and this title should be unique at any given level, (b) one can not delete a tag assigned to an entry (backend check).

