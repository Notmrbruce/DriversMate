import sys
import pandas as pd

input_file = sys.argv[1]
output_file = sys.argv[2]

df = pd.read_excel(input_file, engine='openpyxl')
df.to_csv(output_file, index=False)