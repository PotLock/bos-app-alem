function doesUserHaveDaoFunctionCallProposalPermissions(accountId: string, policy: any) {
  // TODO: break this out (NB: duplicated in Project.CreateForm)
  const userRoles = policy.roles.filter((role: any) => {
    if (role.kind === "Everyone") return true;
    return role.kind.Group && role.kind.Group.includes(accountId);
  });
  const kind = "call";
  const action = "AddProposal";
  // Check if the user is allowed to perform the action
  const allowed = userRoles.some(({ permissions }: any) => {
    return (
      permissions.includes(`${kind}:${action}`) ||
      permissions.includes(`${kind}:*`) ||
      permissions.includes(`*:${action}`) ||
      permissions.includes("*:*")
    );
  });
  return allowed;
}

export default doesUserHaveDaoFunctionCallProposalPermissions;
