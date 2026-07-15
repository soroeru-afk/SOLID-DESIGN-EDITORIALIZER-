with open('App.tsx', 'r') as f:
    content = f.read()

content = content.replace("                )})", "                ))")
content = content.replace("                   )};", "                   );")
content = content.replace("                      )})}  ", "                      ))}  ") # wait
content = content.replace("                      )})} ", "                      ))} ")
content = content.replace("                      )})} \n", "                      ))} \n")
content = content.replace("                      )})}\n", "                      ))}\n")
content = content.replace("                    )};", "                    );")
content = content.replace("                      )} : null}", "                      ) : null}")
content = content.replace("                  )})}\n", "                  ))}\n")
content = content.replace("                  )})} \n", "                  ))} \n")

with open('App.tsx', 'w') as f:
    f.write(content)
