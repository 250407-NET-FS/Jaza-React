namespace Project_2.Data;

public interface IBaseRepository<T> where T : class {
    public Task<IEnumerable<T>> GetAllAsync();
    public Task<T?> GetByIdAsync(Guid guid);
    public Task AddAsync(T entityToAdd);
    public void Remove(T entityToRemove);
    public Task<int> SaveChangesAsync();
}