export const getTeamMembersFunctionDeclaration = {
  name: "get_team_members",
  description: "returns the list of team members of the company",
};

export const getTeamMembers = () => {
  return [{
    name: "Kiran",
    role: "AI Pioneer",
    avatar: "/team/kiran.webp",
    description: "Led transformative projects at Cisco and Helpshift. Built AI teams before it was mainstream."
  }, {
    name: "Vedang",
    role: "Engineering Architect",
    avatar: "/team/vedang.webp",
    description: "Deep systems expertise from Veritas and Helpshift. Scales complex infrastructure with precision."
  }, {
    name: "Kapil",
    role: "Technology Generalist",
    avatar: "/team/kapil.webp",
    description: "Built critical systems at Helpshift. Server whisperer with business acumen."
  }, {
    name: "Prajwalit",
    role: "Frontend Virtuoso",
    avatar: "/team/prajwalit.webp",
    description: "Architected modern web applications at Cleartrip and Helpshift."
  }]
};
