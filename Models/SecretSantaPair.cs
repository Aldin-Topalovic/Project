using System;
using System.Collections.Generic;

namespace SecretSanta.Models;

public partial class SecretSantaPair
{
    public int IdPair { get; set; }

    public int IdGiver { get; set; }

    public int IdReceiver { get; set; }

    public virtual User IdGiverNavigation { get; set; } = null!;

    public virtual User IdReceiverNavigation { get; set; } = null!;
}
public class CreatePairRequest
{
    public int IdGiver { get; set; }
    public int IdReceiver { get; set; }
}