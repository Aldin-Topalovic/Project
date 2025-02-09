using System;
using System.Collections.Generic;

namespace SecretSanta.Models;

public partial class User
{
    public int IdUser { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public int RoleId { get; set; }

    public virtual ICollection<SecretSantaPair> SecretSantaPairIdGiverNavigations { get; set; } = new List<SecretSantaPair>();

    public virtual ICollection<SecretSantaPair> SecretSantaPairIdReceiverNavigations { get; set; } = new List<SecretSantaPair>();
}
