with open('App.tsx', 'r') as f:
    for i, line in enumerate(f):
        if 1083 <= i + 1 <= 1200:
            print(f"{i+1}: {line.rstrip()}")
