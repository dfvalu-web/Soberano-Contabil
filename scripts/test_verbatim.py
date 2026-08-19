with open("test_verbatim.txt", "w", encoding="utf-8") as f:
    f.write("Literal test ${var} and 'quotes' and { braces }")
print("Verbatim success!")
