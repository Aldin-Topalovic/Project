using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace SecretSanta.Models;

public partial class SecretSantaDbContext : DbContext
{
    public SecretSantaDbContext()
    {
    }

    public SecretSantaDbContext(DbContextOptions<SecretSantaDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<SecretSantaPair> SecretSantaPairs { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=.\\SQLEXPRESS;Database=SecretSantaDb;Trusted_Connection=True;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<SecretSantaPair>(entity =>
        {
            entity.HasKey(e => e.IdPair);

            entity.Property(e => e.IdPair).HasColumnName("ID_Pair");
            entity.Property(e => e.IdGiver).HasColumnName("ID_Giver");
            entity.Property(e => e.IdReceiver).HasColumnName("ID_Receiver");

            entity.HasOne(d => d.IdGiverNavigation).WithMany(p => p.SecretSantaPairIdGiverNavigations)
                .HasForeignKey(d => d.IdGiver)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SecretSantaPairs_Users");

            entity.HasOne(d => d.IdReceiverNavigation).WithMany(p => p.SecretSantaPairIdReceiverNavigations)
                .HasForeignKey(d => d.IdReceiver)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SecretSantaPairs_Users1");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.IdUser);

            entity.Property(e => e.IdUser).HasColumnName("ID_User");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("EMail");
            entity.Property(e => e.FirstName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.LastName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.RoleId).HasColumnName("RoleID");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
