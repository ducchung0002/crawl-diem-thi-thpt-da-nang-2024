import pandas as pd
import os

csv_files = [f"{i}.csv" for i in range(1, 10)]
dfs = []

# Define data types for columns that you want to preserve leading zeros
dtype = {'YourColumnName': str}  # Replace 'YourColumnName' with the actual column name

for f in csv_files:
    if os.path.isfile(f) and os.stat(f).st_size != 0:
        try:
            df = pd.read_csv(f, dtype=dtype)
            dfs.append(df)
        except pd.errors.EmptyDataError:
            print(f"Warning: {f} is empty and will be skipped.")

merged_df = pd.concat(dfs, ignore_index=True)
merged_df.to_csv('result.csv', index=False)
