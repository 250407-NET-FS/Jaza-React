using Microsoft.EntityFrameworkCore;

namespace Project_2.Data;

public abstract class BaseRepository<T> : IBaseRepository<T> where T : class {
    private readonly JazaContext _dbContext;
    private readonly DbSet<T> _dbSet;

    public BaseRepository(JazaContext context) {
        _dbContext = context;
        _dbSet = context.Set<T>();
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync() {
        return await _dbSet.ToListAsync();
    }

    public virtual async Task<T?> GetByIdAsync(Guid guid) {
        return await _dbSet.FindAsync(guid);
    }

    /* Marks an an entity as to-be-inserted until its insertion into the db
     * in the next SaveChanges() call. 
     * ENSURE that SaveChanges() is called after this, as it has no effect otherwise
     * Only marked as async for special value generators
     */
    public virtual async Task AddAsync(T entityToAdd) {
        await _dbSet.AddAsync(entityToAdd);
    }

    /* Marks an entity as to-be-deleted until its removal from the db
     * in the next SaveChanges() call. 
     * ENSURE that SaveChanges() is called after this, as it has no effect otherwise
     */
    public virtual void Remove(T entityToRemove) {
        _dbSet.Remove(entityToRemove);
    }

    // Saves any insertions/updates/deletions made to the db
    // Returns the number of rows affected
    public virtual async Task<int> SaveChangesAsync() {
        return await _dbContext.SaveChangesAsync();
    }
}
