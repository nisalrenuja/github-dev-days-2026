# NIC test cases

| Input | Expected |
| --- | --- |
| `951234567V` | valid, old, born 1995, male |
| `958234567v` | valid, old, born 1995, female, normalized to `958234567V` |
| `199512345678` | valid, new, born 1995, male |
| `199582345678` | valid, new, born 1995, female |
| `  951234567X ` | valid, old, normalized to `951234567X` |
| `95123456V` | invalid: too short |
| `951234567Z` | invalid: last letter must be V or X |
| `950004567V` | invalid: day 000 does not exist |
| `954004567V` | invalid: day 400 is between the male and female ranges |
| `199587045678` | invalid: day 870 is past 866 |
| `189912345678` | invalid: birth year before 1900 |
| `abc` | invalid |
